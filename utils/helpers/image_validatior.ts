import { SnackbarStore } from "~/store"

const LIMIT_FILE_SIZE = 10_485_760

const imageValidate = (files: FileList): boolean => {
  let isValid = true

  const fileLength = files.length

  if(fileLength === 0) {
    SnackbarStore.visible({ color: 'warning', message: 'ファイルがありません' })
    isValid = false
  }
  
  for(let i = 0; i < fileLength; i++) {
    if(files[i].size > LIMIT_FILE_SIZE) {
      SnackbarStore.visible({ color: 'warning', message: 'ファイルサイズは10メガバイトまでになります' })
      isValid = false
    }
  }

  for(let i = 0; i < fileLength; i++) {
    if(!files[i].type.startsWith('image/')) {
      SnackbarStore.visible({ color: 'warning', message: '画像以外のファイルは指定できません' })
      isValid = false
    }
  }

  return isValid
}

export default imageValidate