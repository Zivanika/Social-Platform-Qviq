import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router'
import QRCode from 'react-qr-code';
let host = "https://social-platform-qviq-backend.onrender.com";
// let host = "http://localhost:5000";
function Profile() {
    const navigate= useNavigate()
    const [showQR, setShowQR]=useState(false);
    const [textQR, setTextQR]=useState("");
        //!Get all details
        const [details,setDetails]=useState({
            id: "",
            number: "",
            email: "",
            type: "User Type",
        });
        const ref=useRef(null);
        const getDetails = async () => {
            //*API CALL
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("token")
                    },
                });
                const json = await response.json();
                console.log(json)
                setDetails(json.data)
            }
            catch (error) {
                console.error('Error fetching notes:', error);
            }
        }
        useEffect(() => {
            if (localStorage.getItem("token")) {
              getDetails();
            } else {
              navigate("/");
            }
            // eslint-disable-next-line
          }, []); 

    const handleQRCode =  ()=>{
        setShowQR(!showQR);
        let text=`E-mail - ${details.email} || Phone - ${details.number} || Gender - ${details.gender} || Type - ${details.type} `
        setTextQR(text)
    }

    const handleLogOut =()=>{
        localStorage.removeItem('token');
        navigate("/")
    }
    const handleUpdate = async ()=>{
            //*API CALL
            try {
                const response = await fetch(`${host}/api/auth/updateuser/${details._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("token")
                    },
                    body: JSON.stringify(details)
                }); 
                await response.json();
                }catch(error){
                    console.log(error);
                }
            }
    const handleDelete =async()=>{
        try {
            const response = await fetch(`${host}/api/auth/deleteuser/${details._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": localStorage.getItem("token")
                }
            });
            await response.json();
            navigate("/");
            } catch (error) {
            console.log(error);
        }
    }
    function capitalize(str) {
        if (typeof str !== 'string') {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value }); //spread operator to ensure jo bhi values pehle se hain voh rahe aur new values update hojaye eg: [description]:some new value
      };
      const handleClick = (e) => {
        e.preventDefault();
        handleUpdate();
      };
  return (
    <>
          <button
        ref={ref}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      ></button>

       <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          <div
            className="modal-content border-none"
            style={{
              background:
                "linear-gradient(132deg, rgba(187,148,86,1) 0%, rgba(246,228,128,1) 35%, rgba(246,241,186,1) 60%, rgba(202,175,90,1) 100%)",
            }}
          >
            <div className="modal-header border-b-yellow-950">
              <h1
                className="modal-title fs-5 font-semibold"
                id="exampleModalLabel"
              >
                Update Details
              </h1>
              <h3
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></h3>
            </div>
            <form action="">
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="number" className="form-label font-medium">
                    Number
                  </label>
                  <input
                    type="number"
                    className="form-control outline-none indent-4 gold-plate"
                    id="number"
                    name="number"
                    style={{ fontFamily: "'Poppins',sans-serif" }}
                    value={details.number}
                    minLength={3}
                    required
                    placeholder="Enter your mobile number..."
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label font-medium"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control outline-none indent-4 gold-plate"
                    id="email"
                    name="email"
                    style={{ fontFamily: "'Poppins',sans-serif" }}
                    value={details.email}
                    placeholder="Enter your mail id..."
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label font-medium">
                    Type
                  </label>
                  <input
                    type="text"
                    className="form-control outline-none indent-4 gold-plate"
                    id="type"
                    name="type"
                    style={{ fontFamily: "'Poppins',sans-serif" }}
                    value={details.type}
                    placeholder="Enter the type of your account..."
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer border-none pt-0 pb-3">
                {/* <button type="button" className="w-24 h-9 rounded-lg bg-gray-600 hover:bg-gray-700 text-white" data-bs-dismiss="modal">Close</button> */}
                <button disabled={details.email.length < 5 && details.number < 10} 
                  type="submit"
                  onClick={handleClick}
                  className="w-full h-9 rounded-lg  bg-[#472523] hover:bg-[#321918] text-white"
                  data-bs-dismiss="modal"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
<div id='blur' className={`profile-page ${showQR?"blur-mode":""}`} >
  <div className="content ">
    <div className="content__cover">
      <img  className="content__avatar" src={details.image} alt="Profile Avatar" />
      <div className="content__bull"><span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
    <div className="content__actions" >
        <div onClick={handleQRCode}>
      <a>
    <i class="fa-solid fa-qrcode mx-2 scale-125"></i><span className='select-none cursor-pointer'>Show QR</span></a>
            </div>
    <a onClick={handleLogOut}>
    <i class="fa-solid fa-right-from-bracket mx-2 scale-125"></i><span className='select-none cursor-pointer'>Log out</span></a></div>
    <div className="content__title ">
      <h1>{details.email}</h1>
    </div>

    <div className="content__description space-y-2">
      <p>Account Type - {capitalize(details.type)}</p>
      <p>Gender - {capitalize(details.gender)}</p>
      <p>Phone - {details.number}</p>
    </div>
    <button className='hover:scale-110 transition-all ease-in-out duration-600 theme-orange absolute z-20 bottom-[72px] right-64  w-28 h-12 rounded-3xl text-white cursor-pointer' onClick={handleDelete}>Delete</button>
    <div className="content__button -translate-x-16 hover:scale-110 transition-all ease-in-out duration-600"><a className="button" onClick={()=>{ref.current.click();}}>
        <div className="button__border"></div>
        <div className="button__bg"></div>
        <p className="button__text text-center -translate-y-2">Update</p></a></div>
  </div>
  <div className="bg">
    <div><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
  </div>

</div>
<div id='popup' className={`${showQR?"blur-mode":""}`} onClick={()=>{setShowQR(!showQR)}}>
        <QRCode value={textQR}/>
    </div>
    </>
  )
}

export default Profile;