import {
  ref,
  nextTick,
  computed,
} from '@nuxtjs/composition-api'
import { Polyline, Rect } from 'interface'
import { SnackbarStore, SvgsStore } from '~/store'
import { isAddPathMode } from '~/utils/svgs/svg-add-path'
import { isAddPolylineMode } from '~/utils/svgs/svg-add-polyline'
import { isSpaceKeyPress } from '~/utils/helpers/add-event-space-press'
import { isEditPage } from '~/utils/ui/common'

/** 名前編集モードのフラグ */
const isEditSvgName = ref(false)

/** ピン挿入モード、マーカー挿入モードまたはスクロールモードのときtrueを返す。 */
const isAnyMode = computed(() => {
  return isAddPathMode.value || isAddPolylineMode.value ||  isSpaceKeyPress.value
})

/** isEditSvgNameフラグをtrueに変更し、名前入力フォームにフォーカスする。編集ページ以外はリターンする。 */
const editSvgName = (svg: Rect | Polyline) => {
  if (!isEditPage.value) return
  isEditSvgName.value = true
  nextTick(() => {
    document.getElementById(`edit-svg-form-${svg.id}`)?.focus()
  })
}

/** svgのnameを更新する。先頭が空白から始まる場合は変更前のnameに戻した上でリターンする。 */
const updateSvgName = (e: KeyboardEvent, svg: Rect | Polyline) => {
  const target = e.target as HTMLInputElement
  const name = target.value
  if (!/^\S+/.test(name)) {
    SnackbarStore.visible({
      color: 'warning',
      message: '先頭の文字に空白を入力することはできません',
    })
    target.value = svg.name
    return
  }
  SvgsStore.changeSvg({
    status: 'name',
    value: name,
    otherTargetId: svg.id,
  })
  isEditSvgName.value = false
}

export default { isAnyMode, isEditSvgName, editSvgName, updateSvgName }