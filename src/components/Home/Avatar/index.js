import { useState, useEffect } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import "./Avatar.css";
import { API_BASE_URL } from "../Table/api";
import { showError, showSuccess } from "../Table/swal";
import { Link, useNavigate } from "react-router-dom";

function Avatar() {
  const navigate = useNavigate();

  const [showInfo, setShowInfo] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`${API_BASE_URL}/user/detail/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(await response.json());
    };
    getUser();
  }, []);

  const handleButtonChangePassword = async () => {
    if (newPassword !== newPassword2) {
      showError("Mật khẩu không khớp");
    } else if (newPassword.length < 8) {
      showError("Mật khẩu phải có ít nhất 8 ký tự");
    } else if (newPassword === oldPassword) {
      showError("Mật khẩu mới không được trùng với mật khẩu cũ");
    } else if (newPassword === newPassword2 && newPassword.length >= 8) {
      await changePassword();
    }
  };
  const changePassword = async () => {
    const accessToken = localStorage.getItem("access");
    try {
      const response = await fetch(`${API_BASE_URL}/user/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      if (response.status !== 200) {
        throw new Error("Đổi mật khẩu thất bại");
      }
      showSuccess("Đổi mật khẩu thành công");
    } catch (error) {
      throw new Error("Đổi mật khẩu thất bại");
    }
  };
  const handleSignOut = async () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };
  const handleShowInfo = () => {
    setShowInfo(!showInfo);
    setChangePass(false);
  };

  const handleChangePass = () => {
    setChangePass(true);
  };

  const handleBackInfo = () => {
    setChangePass(false);
  };

  return (
    <div className="avatar">
      <div className="avatar__icon">
        <RxAvatar onClick={handleShowInfo} />
      </div>
      {changePass === false ? (
        <div>
          {showInfo && (
            <div className="avatar__info">
              <h3 className="avatar__username">{user.username}</h3>
              <div className="avatar__email">{user.email}</div>
              <div className="avatar__changepass" onClick={handleChangePass}>
                Đổi mật khẩu
              </div>
              <button onClick={handleSignOut} className="avatar__changepass">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="avatar__changePassForm">
          <FaArrowAltCircleLeft onClick={handleBackInfo} />
          <h3
            style={{ textAlign: "center", marginBottom: "15px", color: "#333" }}
          >
            Đổi Mật Khẩu
          </h3>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            onChange={(e) => {
              setNewPassword2(e.target.value);
            }}
          />
          <button onClick={handleButtonChangePassword}>Đổi mật khẩu</button>
        </div>
      )}
    </div>
  );
}
export default Avatar;
