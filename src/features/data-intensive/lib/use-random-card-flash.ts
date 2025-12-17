interface UseRandomCardFlashParams {
  container: HTMLDivElement | null;
  isEnabled: boolean;
  flashCount?: number;
  flashDurationMs?: number;
  intervalMs?: number;
}

// Flashing is temporarily disabled. We keep the API so call sites don't break.
export const useRandomCardFlash = (_params: UseRandomCardFlashParams) => {};
