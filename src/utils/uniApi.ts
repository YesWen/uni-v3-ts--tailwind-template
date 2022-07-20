export function Toast(title: string, options?: Partial<UniApp.ShowToastOptions>) {
  uni.showToast({
    title: title,
    duration: 1500,
    icon: 'none',
    ...options,
  });
}
export function hideToast() {
  uni.hideToast();
}
