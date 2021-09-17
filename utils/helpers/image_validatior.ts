import { SnackbarStore } from "~/store"

const LIMIT_FILE_SIZE = 10_485_760

const imageValidate = (files: FileList): boolean => {
  let isValid = true

  if(files.length === 0) {
    SnackbarStore.visible({ color: 'warning', message: 'ファイルがありません' })
    isValid = false
  }

  if(files[0].size > LIMIT_FILE_SIZE) {
    SnackbarStore.visible({ color: 'warning', message: 'ファイルサイズは10メガバイトまでになります' })
    isValid = false
  }

  if(!files[0].type.startsWith('image/')) {
    SnackbarStore.visible({ color: 'warning', message: '画像以外のファイルは指定できません' })
    isValid = false
  }

  return isValid
}

export default imageValidate