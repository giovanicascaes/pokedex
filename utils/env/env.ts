import { RenderingSide } from "./env.types"

class Env {
  private current: RenderingSide = this.detect()

  get isServer(): boolean {
    return this.current === "server"
  }

  get isClient(): boolean {
    return this.current === "client"
  }

  private detect(): RenderingSide {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return "server"
    }

    return "client"
  }
}

export const env = new Env()
