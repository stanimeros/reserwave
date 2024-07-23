import React, { useEffect, useState, useRef} from 'react'
import Translator from '../Translator';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import StoreSettings from './StoreSettings';

function AccountSettings({GlobalState}) {
  const {
    api, language,
    userData, setUserData,
  } = GlobalState;

  async function upgradeAccount(){
    try {
      if (!userData.email){
        throw new Error("No Email Found");
      }
      const response = await fetch(`${api}/upgrade_account.php?token=${userData.token}`);
      const data = await response.json();
      if (data.status=="success"){
        Toastify({
          text: Translator({code:language, value:"Success"}).props.children,
          duration: 3000,
          className: "toast success",
          gravity: "bottom",
          position: "right", 
        }).showToast();
      }else{
        throw new Error(data.status);
      }
    } catch (error) {
      console.error('upgradeAccount:', error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally {
      // setLoading(false);
      getUserData();
    }
  }

  const getUserData = async () => {
    try {
      const response = await fetch(`${api}/get_user.php?token=${userData.token}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }

    } catch (error) {
      console.error('getUserData:', error);
    }
  };

  return (
    <>
      <div className='settings-section'>
        <h2>
          <Translator
            code={language}
            value={"Account Settings"}
          />
        </h2>
        <table className='column-based'>
          <tbody>
            <tr>
              <th>
                <Translator
                  code={language}
                  value={"Full Name"}
                />
                :
              </th>
              <td>
                {userData.first_name} {userData.last_name}
              </td>
            </tr>
            <tr>
              <th>
                <Translator
                  code={language}
                  value={"Phone"}
                /> 
                :
              </th>
              <td>
                {userData.phone}
              </td>
            </tr>
            <tr>
              <th>
                <Translator
                  code={language}
                  value={"Email"}
                />
                :
              </th>
              <td>
                {userData.email}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {userData.role=='customer' ? (
        <>
          <button className='button' onClick={upgradeAccount}>
            <Translator
              code={language}
              value={`Add your store`}
            />
          </button>
        </>
      ) : (
        <>
          <StoreSettings
            GlobalState={GlobalState}
          />
        </>
      )}
    </>
  )
}

export default AccountSettings
