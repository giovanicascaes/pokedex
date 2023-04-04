import { HydrationState, RenderingSide } from "./env.types"

class Env {
  private current: RenderingSide = this.detect()

  private hydrationState: HydrationState = "pending"

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

  completeHydration(): void {
    if (this.hydrationState === "pending") {
      this.hydrationState = "complete"
    }
  }

  get isHydrationComplete(): boolean {
    return this.hydrationState === "complete"
  }
}

export const env = new Env()
