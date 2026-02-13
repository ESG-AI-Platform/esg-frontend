class TelemetryService {
  private static instance: TelemetryService
  private endpoint = '/api/v1/telemetry'

  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService()
    }
    return TelemetryService.instance
  }

  public async trackEvent(name: string, properties?: Record<string, unknown>) {
    try {
      await fetch(`${this.endpoint}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          properties,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (e) {
      console.error('Failed to send telemetry event', e)
    }
  }

  public async trackError(error: unknown, context?: Record<string, unknown>) {
    try {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      await fetch(`${this.endpoint}/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: errorObj.message,
          stack: errorObj.stack,
          context,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (e) {
      console.error('Failed to send telemetry error', e)
    }
  }

  public async trackDuration(name: string, durationMs: number, properties?: Record<string, unknown>) {
    try {
      await fetch(`${this.endpoint}/duration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          duration: durationMs,
          properties,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (e) {
      console.error('Failed to send telemetry duration', e)
    }
  }
}

export const telemetry = TelemetryService.getInstance()
