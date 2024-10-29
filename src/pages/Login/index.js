import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/Home/Table/api.js";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../components/Home/Table/swal.js";
import "./login.css";

function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);


  const changeUsername = (e) => setUser(e.target.value);
  const changePass = (e) => setPass(e.target.value);
  const toggleRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/user/token/`, {
        username,
        password,
      });
      if (rememberMe) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      } else {
        sessionStorage.setItem("access", data.access);
        sessionStorage.setItem("refresh", data.refresh);
      }
      navigate("/home");
    } catch (error) {
      showError("Đăng nhập thất bại");
    }
  };

  const handleNavigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="form-container">
            <div className="card shadow">
              <div className={`card-body ${isMounted ? "slide-in" : ""}`}>
                <h3 className="mb-5 text-center">Đăng Nhập</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typeUsernameX-1">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      id="typeUsernameX-1"
                      className="form-control"
                      onChange={changeUsername}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typePasswordX-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="typePasswordX-1"
                      className="form-control"
                      onChange={changePass}
                    />
                  </div>

                  <div className="form-check mb-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMeCheckbox"
                      checked={rememberMe}
                      onChange={toggleRememberMe}
                    />
                    <label className="form-check-label" htmlFor="rememberMeCheckbox">
                      Nhớ mật khẩu
                    </label>
                  </div>

                  <div className="d-flex justify-content-center align-items-center mb-4">
                    <p className="mb-0">Bạn chưa có tài khoản?</p>
                    <button type = "button" className="link-btn ml-2" onClick={handleNavigateToSignup}>
                      Đăng ký ngay
                    </button>
                  </div>

                  <button
                    className="custom-btn"
                    type="submit"
                  >
                    Đăng Nhập
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
