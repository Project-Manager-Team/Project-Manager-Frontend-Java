import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../components/Home/Table/api.js";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../components/Home/Table/swal.js";
function SignUp() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(username);
    console.log(email);
    console.log(password);
  };
  const changeUsername = (e) => {
    setUser(e.target.value);
  };
  const changePass = (e) => {
    setPass(e.target.value);
  };
  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
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
                    Sign Up
                  </h3>

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
                      <label
                        className="form-label"
                        htmlFor="typeEmailX-2"
                        style={{ textAlign: "right" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="typeEmailX-2"
                        className="form-control form-control-lg email"
                        onChange={changeEmail}
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
                    <button
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-primary btn-lg btn-block button"
                      type="submit"
                      style={{ width: "100%", marginBottom: "20px" }}
                      onClick={handleClick}
                    >
                      Sign Up
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
export default SignUp;
