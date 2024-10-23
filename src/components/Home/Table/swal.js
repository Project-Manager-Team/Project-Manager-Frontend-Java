// Hàm để hiển thị thông báo thành công
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

// Hàm để hiển thị thông báo lỗi
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

// Hàm để hiển thị thông báo cảnh báo
export async function showWarning(message) {
  await Swal.fire("Warning", message, "warning");
}

// Hàm để hiển thị thông báo thông tin
export async function showInfo(message) {
  await Swal.fire("Info", message, "info");
}