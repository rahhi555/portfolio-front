import { ref } from '@nuxtjs/composition-api'

/** 
 * チュートリアル実行中ならtrueになる。   
 * 他のチュートリアルファイルはssr時に読み込むとエラーになる、provide-injectはmiddlewareで使用できない、この変数のためだけにstoreを作成するのは大げさすぎる等の理由から、   
 * このファイル単体で管理する。
 * */
 export const isRunningTutorial = ref(false)
