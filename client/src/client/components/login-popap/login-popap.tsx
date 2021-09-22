import React, { Dispatch, SetStateAction, useDebugValue, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UpdateUser } from "../../store/actions";

// import { UpdateUser } from "../../store/actions";

import "./login-popap.scss";

interface ILoginPopap {
  statePopap: Dispatch<SetStateAction<boolean>>;
}

export const LoginPopap = ({ statePopap }: ILoginPopap) => {

  const dispatch = useDispatch()
  const {isActive, id} = useSelector((sel:any) => sel.game)
  const test = useSelector((sel:any) => sel)

  const [isFormValid, setIsFormValid] = useState(true);
  const [userForm, setUserForm] = useState({
    name: "",
    lastName: "",
    jobPosition: "value1",
    role: "player",
    photoUser: "",
  });

  function addedPhotoUser(e: React.ChangeEvent<any>) {
    const file = e.target.files[0];

    const render = new FileReader();

    render.onload = (event) => {
      setUserForm({
        ...userForm,
        [e.target.name]: event.target?.result,
      });
    };

    render.readAsDataURL(file);
  }

useEffect(()=>{
  const reg = /([a-z])\w+/;
  if(!reg.test(String(userForm.name).toLowerCase())){
    setIsFormValid(false)
  }else{
    setIsFormValid(true)
  }

}, [userForm.name])

  return (
    <div className="login_popap">
      <div className="login_popap-wrapper">
        <h2>Login Popap</h2>
        <form>
          <div className="photo_user-wrapper">
            <label htmlFor="photoUser">
              {!userForm.photoUser ? (
                <p>Added photo</p>
              ) : (
                <img
                  src={userForm.photoUser}
                  alt={userForm.name && (userForm.name)}
                />
              )}

              <input
                type="file"
                name="photoUser"
                id="photoUser"
                accept=".png, jpg, .jpeg"
                onChange={(e) => addedPhotoUser(e)}
              />
            </label>
          </div>
          <label htmlFor="name">
            <p>First Name:</p>
            <input
              type="text"
              name="name"
              id="name"
              value={userForm.name}
              onChange={(e) => setUserForm({...userForm, name: e.target.value})}
            />
            <p>{!isFormValid && ('Wrong data..')}</p>
          </label>

          <label htmlFor="lastName">
            <p>Last Name:</p>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={userForm.lastName}
              onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
            />
          </label>

          <label htmlFor="jobPosition">
            <p>Job Position:</p>
            <select
              id="jobPosition"
              name="jobPosition"
              onChange={(e) => setUserForm({...userForm, jobPosition: e.target.value})}
            >
              <option value="value1">value1</option>
              <option value="value2">value2</option>
              <option value="value3">value3</option>
            </select>
          </label>
          <label htmlFor="isRole">
            <p>You observer?</p>
            <input 
            type="checkbox" 
            name="isRole"
            id="isRole" />
          </label>
          <div className="btn_wrapper">

            <NavLink to={`/${isActive ? 'game': 'lobby'}/${id}`}>
            <button 
            type="submit" 
            disabled={!isFormValid} 
            onClick = {()=> dispatch(UpdateUser({...userForm}))}
            >
              Check Button
            </button>
            </NavLink>

            <button 
            type="button" 
            onClick={() => statePopap(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
