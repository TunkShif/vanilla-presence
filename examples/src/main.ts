import type { DialogElement } from "./dialog"
import "./dialog"
import "./style.css"

const dialog = document.querySelector<DialogElement>("#dialog")!
dialog.querySelector("[data-part='content'] > footer > button")!.addEventListener("click", () => dialog.close())
