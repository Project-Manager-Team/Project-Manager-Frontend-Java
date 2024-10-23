import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../components/Home/Table/api.js";
import { showSuccess, showError } from "../../components/Home/Table/swal.js";
function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRemember(e.target.checked);
  };

  const handleClick = () => {
    console.log(username);
    console.log(password);
  };
  const changeUsername = (e) => {
    setUser(e.target.value);
  };
  const changePass = (e) => {
    setPass(e.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (remember) {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);
    } else {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/user/token/`, {
        username,
        password,
      });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      setTimeout(() => {
        navigate("/home");
      }, 200);
    } catch (error) {
      showError("Đăng nhập thất bại");
    }
  };

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card shadow-2-strong"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-5">
                  <h3 className="mb-5" style={{ textAlign: "center" }}>
                    Sign in
                  </h3>
                  <p style={{ textAlign: "right" }}>
                    Don't have an account?<Link to="/signup">Sign Up</Link>
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <label
                        className="form-label"
                        htmlFor="typeUsernameX-2"
                        style={{ textAlign: "right" }}
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="typeUsernameX-2"
                        className="form-control form-control-lg username"
                        onChange={changeUsername}
                      />
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <label className="form-label" htmlFor="typePasswordX-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="typePasswordX-2"
                        className="form-control form-control-lg password"
                        onChange={changePass}
                      />
                    </div>

                    <div className="form-check d-flex justify-content-start mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="form1Example3"
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="form1Example3"
                      >
                        {" "}
                        Remember password{" "}
                      </label>
                    </div>

                    <button
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-primary btn-lg btn-block button"
                      type="submit"
                      style={{ width: "100%", marginBottom: "20px" }}
                      onClick={handleClick}
                    >
                      Sign in
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Login;
