
import { toast } from "vue3-toastify";

export const showToast=(msg,type)=>{
  toast(msg, {
  "theme": "auto",
  "type": type,
  "dangerouslyHTMLString": true
})
}