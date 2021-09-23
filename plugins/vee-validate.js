import Vue from 'vue'
import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja.json'
import { required, email, max, min, alpha_dash, size } from 'vee-validate/dist/rules'

extend('required', required ) 
extend('email', email )       
extend('max', max )           
extend('min', min)
extend('alpha_dash', alpha_dash)
extend('size', size)
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: '入力したパスワードと一致しません'
})
extend('beginTime', {
  params: ['target'],
  validate(value, { target }) {
    if(!target) return true
    return value < target;
  },
  message: '終了より遅い時刻です'
})
extend('endTime', {
  params: ['target'],
  validate(value, { target }) {
    if(!target) return true
    return target < value;
  },
  message: '開始より早い時刻です'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
localize('ja', ja)