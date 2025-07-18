import { Button } from "@pathscale/ui";
import { type Component, For } from "solid-js";
import { toastStore } from "~/stores/toastStore";

export const ToastContainer: Component = () => {
  return (
    <div class="toast toast-end z-50">
      <For each={toastStore.toasts()}>
        {(toast) => (
          <div
            class={`alert ${
              toast.type === "error"
                ? "alert-error"
                : toast.type === "success"
                  ? "alert-success"
                  : toast.type === "warning"
                    ? "alert-warning"
                    : "alert-info"
            } shadow-lg`}
          >
            <div>
              <span>{toast.message}</span>
              <Button shape="circle" size="xs" onClick={() => toastStore.removeToast(toast.id)}>
                ✕
              </Button>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default ToastContainer;
