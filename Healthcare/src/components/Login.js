// Login.js
import { useContext, useState } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const { getContractForWrite, connectedAccount, isAdmin, isDoctor } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center mt-4 mb-4">
      <div className="flex flex-col items-center justify-center w-[500px] h-[300px] rounded-lg shadow-gray-500 shadow-xl border-[1px] border-gray-400 gap-4">
        <img className="w-40" src="./logo.png" alt="logo" />
        <button
          onClick={async () => {
            const e = document.getElementById("errMsg");
            await getContractForWrite();
            if (await isAdmin(connectedAccount)) {
              navigate("/adminPage");
            } else {
              e.style.color = "red";
              setErrMsg("You are not a admin");
            }
          }}
          className="bg-green-600 rounded-lg p-2 text-white font-semibold hover:bg-green-800"
        >
          Admin Login
        </button>
        <button
          onClick={async () => {
            const e = document.getElementById("errMsg");
            await getContractForWrite();
            if (await isDoctor(connectedAccount)) {
              navigate("/doctorPage");
            } else {
              e.style.color = "red";
              setErrMsg("You are not a doctor");
            }
          }}
          className="bg-blue-600 rounded-lg p-2 text-white font-semibold hover:bg-blue-800"
        >
          Doctor Login
        </button>
        <div id="errMsg">{errMsg}</div>
      </div>
    </div>
  );
}

export default Login;
