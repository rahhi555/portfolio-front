import { computed, ref, watch, nextTick } from "@nuxtjs/composition-api"

/** 全ての[data-tutorial]に指定されている値(便宜上キーと呼ぶ) */
export type DataTutorialKey = 'create-plan-btn' | 'create-plan-input' | 'create-plan-check'

/** 現在のシナリオの[data-tutorial]キーを格納する変数。初期値が一番最初に開始するシナリオ */
const nowScenarioKey = ref<DataTutorialKey>('create-plan-btn')

/** ユーザーが操作可能な箇所 */
export const targetElement = ref<HTMLElement>()

/** 現在のシナリオのツールチップに表示するメッセージ */
export const nowTooltipMessage = computed(() => {
  return tutorialScenarioTable.get(nowScenarioKey.value)?.tooltip
})

/** 次のシナリオキー */
const nextKey = computed(() => {
  let isNowScenarioKey = false
  for(const key of tutorialScenarioTable.keys()) {
    if(isNowScenarioKey) return key  

    if(key === nowScenarioKey.value) isNowScenarioKey = true
  }
})

/** 
 * 現在のシナリオキーが切り替わるたびtargetElementを更新し、achievementConditionsFuncも実行してイベント登録をする     
 * チュートリアル関連のwatchの中でこれが一番最初に起動する
 * */
watch(nowScenarioKey, async () => {
  // ツールチップのみ先に出現することを防ぐため、ツールチップが存在していれば一旦隠す
  const tutorialTooltip = document.getElementById('tutorial-tooltip')
  if(tutorialTooltip) tutorialTooltip.style.visibility = 'hidden'

  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 300))

  targetElement.value = document.querySelector(`[data-tutorial=${nowScenarioKey.value}]`) as HTMLElement
  
  tutorialScenarioTable.get(nowScenarioKey.value)?.achievementConditionsFunc()
}, { immediate: true })

/** achievementConditionsFuncを集約する変数。イベントリスナを登録、あるいは値を監視し、条件を満たせばnowScenarioKeyに次のキーを代入する */
const achievementConditionsFuncs = {
  createPlanBtn: () => {
    targetElement.value!.addEventListener('click',() => {
      nowScenarioKey.value = nextKey.value!
    })
  },

  createPlanInput: () => {
    targetElement.value!.addEventListener('change', ({target}) => {
      if((target as HTMLInputElement).value === 'はじめての計画') {
        nowScenarioKey.value = nextKey.value!
      }
    })
  },

  createPlanCheck: () => {
    const checkbox = targetElement.value!.querySelector("input[type='checkbox']")!
    console.log(checkbox)
    
    checkbox.addEventListener('change', () => {
      console.log('input')
    })
  }
}

/** 
 * チュートリアルシナリオテーブル   
 * dataTutorial: [data-tutorial]に指定された名前    
 * achievementConditionsFunc: 達成条件の関数。これが達成されれば次のシナリオに進む
 * tooltip: 操作対象の付近に出現する吹き出しのメッセージ    
 * 配列の順番がシナリオの順番になる
 * */
const tutorialScenarioTable: Map<DataTutorialKey,{ achievementConditionsFunc: () => void, tooltip: string }> =  new Map([
  [ 'create-plan-btn', { achievementConditionsFunc: () => achievementConditionsFuncs.createPlanBtn(), tooltip: 'クリックしてください' }],
  [ 'create-plan-input',{ achievementConditionsFunc: () => achievementConditionsFuncs.createPlanInput(), tooltip: '「はじめての計画」と入力してください' }],
  [ 'create-plan-check',{ achievementConditionsFunc: () => achievementConditionsFuncs.createPlanCheck(), tooltip: 'チェックボックスをチェックしてください' }],
])
