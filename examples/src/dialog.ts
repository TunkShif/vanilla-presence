import { Presence, createPresence } from "../../src/index"

export class DialogElement extends HTMLElement {
  private trigger: HTMLElement
  private backdrop: HTMLElement
  private content: HTMLElement

  private backdropPresence!: Presence
  private contentPresence!: Presence

  constructor() {
    super()

    this.trigger = this.querySelector<HTMLElement>("[data-part='trigger']")!
    this.backdrop = this.querySelector<HTMLElement>("[data-part='backdrop']")!
    this.content = this.querySelector<HTMLElement>("[data-part='content']")!
  }

  connectedCallback() {
    this.trigger.addEventListener("click", this.handleClick.bind(this))

    this.backdropPresence = createPresence(this.isOpen, this.backdrop)
    this.contentPresence = createPresence(this.isOpen, this.content)
  }

  disconnectedCallback() {
    this.backdropPresence.cleanup()
    this.contentPresence.cleanup()
  }

  get isOpen() {
    return this.dataset.state === "open"
  }

  open() {
    this.dataset.state = "open"
    this.backdropPresence.open()
    this.contentPresence.open()
  }

  close() {
    this.dataset.state = "closed"
    this.backdropPresence.close()
    this.contentPresence.close()
  }

  handleClick() {
    this.open()
  }
}

customElements.define("x-dialog", DialogElement)
