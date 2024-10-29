import Swal from "sweetalert2/dist/sweetalert2.js";

export async function showSuccess(message) {
  await Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

export async function showError(message) {
  await Swal.fire("Error", message, "error");
}

export async function showConfirm(message) {
  return await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  });
}

export async function showWarning(message) {
  await Swal.fire("Warning", message, "warning");
}

export async function showInfo(message) {
  await Swal.fire("Info", message, "info");
}