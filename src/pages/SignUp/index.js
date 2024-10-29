import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/Home/Table/api.js";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../components/Home/Table/swal.js";
import "./signup.css";

function SignUp() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false)
  }, []);

  const handleClick = () => {
    console.log(username);
    console.log(email);
    console.log(password);
  };

  const changeUsername = (e) => setUser(e.target.value);
  const changePass = (e) => setPass(e.target.value);
  const changeEmail = (e) => setEmail(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/user/register/`, {
        username,
        email,
        password,
      });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      navigate("/login");
    } catch (error) {
      showError("Đăng ký thất bại");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="form-container">
            <div className="card shadow">
              <div className={`card-body ${isMounted ? "slide-in" : ""}`}>
                <h3 className="mb-5 text-center">Đăng Ký</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typeUsernameX-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      id="typeUsernameX-2"
                      className="form-control"
                      onChange={changeUsername}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typeEmailX-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="typeEmailX-2"
                      className="form-control"
                      onChange={changeEmail}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typePasswordX-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="typePasswordX-2"
                      className="form-control"
                      onChange={changePass}
                    />
                  </div>

                  <div className="d-flex justify-content-center align-items-center mb-4">
                    <p className="mb-0">Bạn đã có tài khoản?</p>
                    <button type = "button" className="link-btn ml-2" onClick={handleNavigateToLogin}>
                      Đăng nhập
                    </button>
                  </div>

                  <button
                    className="custom-btn"
                    type="submit"
                    onClick={handleClick}
                  >
                    Đăng Ký
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

export default SignUp;
