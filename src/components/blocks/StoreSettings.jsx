import React, { useEffect, useState, useRef} from 'react'
import Translator from '../Translator';
import { Link } from "react-router-dom";
import SubscriptionPortal from '../buttons/SubscriptionPortal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpRightFromSquare,faUpload,faEyeSlash,faTrashCan} from '@fortawesome/free-solid-svg-icons';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

function StoreSettings({GlobalState}) {
  const {
    api, language,
    userData,
  } = GlobalState;

  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [loading,setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const [storeData, setStoreData] = useState([]);
  const [createStore,setCreateStore] = useState(false);
  const [updateStoreData, setUpdateStoreData] = useState(false);

  const [storeServicesData,setStoreServicesData] = useState([]);
  const [storeWorkingHoursData,setStoreWorkingHoursData] = useState([]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        if (!userData.email){
          throw new Error("No Email Found");
        }
        const response = await fetch(`${api}/subscription_status.php?email=${userData.email}`);
        const data = await response.json();
        if (data.subscriptionStatus=="active"){
          setSubscriptionStatus(true);
        }else{
          setSubscriptionStatus(false);
        }
      } catch (error) {
        console.error('fetchSubscriptionStatus:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchSubscriptionStatus();
    fetchStoreData();
    fetchCategories();
  },[])

	useEffect(() => {
		if (createStore){
			const addStore = async () => {
				try {
					if (!userData.email){
						throw new Error("No Email Found");
					}
					const response = await fetch(`${api}/add_store.php?token=${userData.token}`);
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
					console.error('addStore:', error);
					Toastify({
						text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
						duration: 3000,
						className: "toast warning",
						gravity: "bottom",
						position: "right",
					}).showToast();
				} finally {
					fetchStoreData();
					setLoading(false);
				}
			};

			addStore();
			setCreateStore(false);
		}
  },[createStore])

  const fetchStoreData = async () => {
    if (userData.id){
      try {
        const response = await fetch(`${api}/get_store.php?adminId=${userData.id}`);
        const data = await response.json();
        if (data.length == 0) {
          setCreateStore(true);
        }else{
          setStoreData(data[0]);
        }
      } catch (error) {
        console.error('fetchStoreData:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchStoreServicesData = async () => {
    if (storeData.slug){
      try {
        const response = await fetch(`${api}/get_store_services.php?storeSlug=${storeData.slug}`);
        const data = await response.json();
        setStoreServicesData(data);
      } catch (error) {
        console.error('fetchStoreServicesData:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchStoreWorkingHoursData = async () => {
    if (storeData.slug){
      try {
        const response = await fetch(`${api}/get_store_working_hours.php?storeSlug=${storeData.slug}`);
        const data = await response.json();
        setStoreWorkingHoursData(data);
      } catch (error) {
        console.error('fetchStoreWorkingHoursData:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${api}/get_services.php`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('fetchCategories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (storeServicesData.length==0 || storeServicesData.some(service => service.unsaved)){
      fetchStoreServicesData();
    }

    if (storeWorkingHoursData.length==0 || storeWorkingHoursData.some(workingHour => workingHour.unsaved)){
      fetchStoreWorkingHoursData();
    }

    if (updateStoreData){
      updateStoreSettings();
      setUpdateStoreData(false);
      // const timerId = setTimeout(() => {
      // //Do
      // }, 1500);
      // return () => {
      //   clearTimeout(timerId);
      // };
    }

  },[storeData])

  function addServiceRow(){
    var newService= {};
    newService.id = 0;
    newService.status = "1";
    newService.unsaved = true;
    newService.store_id = storeData.id;
    newService.description = "";
    newService.duration = "";
    newService.concurrent = "";
    newService.price = "";
    newService.list_price = "";
    newService.independent = "0";
    newService.auto_accept = "0";
    newService.controller= "buttons";
    newService.can_combine_with_ids = "";
    newService.can_not_combine_with_ids = "";

    const updatedStoreServicesData = [...storeServicesData];
    updatedStoreServicesData.push(newService);
    setStoreServicesData(updatedStoreServicesData);
  }

  function addWorkingHourRow(){
    var newWorkingHour = {};
    newWorkingHour.id = 0;
    newWorkingHour.status = 1;
    newWorkingHour.unsaved = true;
    newWorkingHour.store_id = storeData.id;
    newWorkingHour.day = 1;
    newWorkingHour.start_time = `09:00`;
    newWorkingHour.end_time = `17:00`;

    const updatedStoreWorkingHoursData = [...storeWorkingHoursData];
    updatedStoreWorkingHoursData.push(newWorkingHour);
    setStoreWorkingHoursData(updatedStoreWorkingHoursData);
  }

  function disableServiceRow(index){
    const updatedStoreServicesData = [...storeServicesData];
    if (updatedStoreServicesData[index].status===1){
      updatedStoreServicesData[index].status = 0;
    }else{
      updatedStoreServicesData[index].status = 1;
    }

    updatedStoreServicesData[index].unsaved = true;
    setStoreServicesData(updatedStoreServicesData);
  }

  function disableWorkingHourRow(index){
    const updatedStoreWorkingHoursData = [...storeWorkingHoursData];
    if (updatedStoreWorkingHoursData[index].status===1){
      updatedStoreWorkingHoursData[index].status = 0;
    }else{
      updatedStoreWorkingHoursData[index].status = 1;
    }

    updatedStoreWorkingHoursData[index].unsaved = true;
    setStoreWorkingHoursData(updatedStoreWorkingHoursData);
  }

  function removeServiceRow(index){
    const updatedStoreServicesData = [...storeServicesData];
    updatedStoreServicesData[index].status = 2;
    updatedStoreServicesData[index].unsaved = true;
    setStoreServicesData(updatedStoreServicesData);
  }

  function removeWorkingHourRow(index){
    const updatedStoreWorkingHoursData = [...storeWorkingHoursData];
    updatedStoreWorkingHoursData[index].status = 2;
    updatedStoreWorkingHoursData[index].unsaved = true;
    setStoreWorkingHoursData(updatedStoreWorkingHoursData);
    setUpdateWorkingHoursData(true);
  }

  async function saveServices(){

    if (!storeServicesData.some(service => service.unsaved)){
      Toastify({
        text: Translator({code:language, value:"Success"}).props.children,
        duration: 3000,
        className: "toast success",
        gravity: "bottom",
        position: "right", 
      }).showToast();
      return;
    }

    try {
      const response = await fetch(`${api}/update_store_services.php?token=${userData.token}`, {
        method: 'UPDATE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeServicesData),
      });
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
      console.error('saveServices:',error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally{
      setLoading(false);
      fetchStoreServicesData();
    }
  }

  async function saveWorkingHours(){

    if (!storeWorkingHoursData.some(workingHour => workingHour.unsaved)){
      Toastify({
        text: Translator({code:language, value:"Success"}).props.children,
        duration: 3000,
        className: "toast success",
        gravity: "bottom",
        position: "right", 
      }).showToast();
      return;
    }

    try {
      const response = await fetch(`${api}/update_store_working_hours.php?token=${userData.token}`, {
        method: 'UPDATE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeWorkingHoursData),
      });
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
      console.error('saveWorkingHours:',error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally{
      setLoading(false);
      fetchStoreWorkingHoursData();
    }
  }

  const storeSettingChanged = (event, fieldName) => {
    const newValue = event.target.value;

    if (newValue.length==0 || newValue==storeData[fieldName]){
      return;
    }

    setStoreData((storeData) => {
      const newData = { ...storeData, [fieldName]: newValue };
      return newData;
    });

    setUpdateStoreData(true);
  };

  function serviceRowChanged(index, event, fieldName) {
    const newValue = event.target.value;

    if (newValue.length==0 || newValue==storeServicesData[index][fieldName]){
      return;
    }
  
    setStoreServicesData((storeServicesData) => {
      const newData = [...storeServicesData];  // Create a copy of the array
      newData[index] = {
        ...newData[index],  // Create a copy of the object at the specified index
        [fieldName]: newValue  // Update the nested property
      };
      newData[index].unsaved = true;
      return newData;
    });
  }

  function workingHourRowChanged(index, event, fieldName) {
    const newValue = event.target.value;

    if (newValue.length==0 || newValue==storeWorkingHoursData[index][fieldName]){
      return;
    }
  
    setStoreWorkingHoursData((storeWorkingHoursData) => {
      const newData = [...storeWorkingHoursData];  // Create a copy of the array
      newData[index] = {
        ...newData[index],  // Create a copy of the object at the specified index
        [fieldName]: newValue  // Update the nested property
      };
      newData[index].unsaved = true;
      return newData;
    });
  }

  async function updateStoreSettings(){
    const requestData = {
      token: userData.token,
      storeId: storeData.id,
      title: storeData.title,
      slug: storeData.slug,
      service_slug: storeData.service_slug,
      description: storeData.description,
      phone: storeData.phone,
      street: storeData.street,
      city: storeData.city,
      country: storeData.country,
      zip: storeData.zip,
      concurrent: storeData.concurrent,
      image_url: storeData.image_url,
   };

    try {
      const response = await fetch(`${api}/update_store_settings.php`, {
        method: 'UPDATE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
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
      console.error('updateStoreSettings:',error);
      Toastify({
        text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
        duration: 3000,
        className: "toast warning",
        gravity: "bottom",
        position: "right",
      }).showToast();
    } finally{
      setLoading(false);
      fetchStoreData();
    }
  }

  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${api}/upload_file.php?store_name=${storeData.title}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status=="success"){
        setStoreData((prevStoreData) => ({ ...prevStoreData, image_url: data.image_url }));
        setUpdateStoreData(true);
      }else{
        Toastify({
          text: Translator({code:language, value:"Oops! Something didn't go as planned"}).props.children,
          duration: 3000,
          className: "toast warning",
          gravity: "bottom",
          position: "right",
        }).showToast();
      }
    } catch (error) {
      console.error('handleImageUpload:', error.message);
    }finally{
      setLoading(false);
      fileInputRef.current.value = '';
    }
  };

  return (
		    <>
      {loading ? (
        <>
          {/* SKELETON ITEMS */}
        </>
      ): (
        <>
          <div className='settings-section'>
            <h2>
              <Translator
                code={language}
                value={`Store Settings`}
              />
            </h2>
            <table className='column-based'>
              <tbody>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Name"}
                    />  
                    :
                  </th>
                  <td>
                    <input 
                      type='text' 
                      defaultValue={storeData.title} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'title')}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <Link to={`/${storeData.category_slug}/${storeData.service_slug}/${storeData.slug}`}>
                      <FontAwesomeIcon icon={faUpRightFromSquare} />
                    </Link>
                    <Translator
                      code={language}
                      value={"Slug"}
                    />  
                    :
                  </th>
                  <td>
                    <input 
                      type='text' 
                      defaultValue={storeData.slug} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'slug')}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Category"}
                    />  
                    :
                  </th>
                  <td>
                    <select className='input' defaultValue={storeData.service_slug} onChange={(event) => storeSettingChanged(event, 'service_slug')}>
                      {categories.map((category,index) => (
                        <option key={index} value={category.slug}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Area"}
                    />  
                    :
                  </th>
                  <td>
                    <input 
                      type='text' 
                      defaultValue={storeData.description} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'description')}
                    />
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
                    <input 
                      type='text' 
                      defaultValue={storeData.phone} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'phone')}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Street"}
                    />  
                    :
                  </th>
                  <td>
                    <input 
                      type='text' 
                      defaultValue={storeData.street} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'street')}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"City"}
                    />  
                    :
                  </th>
                  <td>
                    <input 
                      type='text' 
                      defaultValue={storeData.city} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'city')}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Zip Code"}
                    />  
                    :
                  </th>
                  <td>
                    <input 
                      type='text' 
                      defaultValue={storeData.zip} 
                      className='input'
                      onBlur={(event) => storeSettingChanged(event, 'zip')}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Country"}
                    />  
                    :
                  </th>
                  <td>
                    <select className='input' defaultValue={storeData.country} onChange={(event) => storeSettingChanged(event, 'country')}>
                        <option value="Greece">
                          {Translator({code:language,value:`Greece`}).props.children}
                        </option>
                      </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Concurrent"}
                    />  
                    :
                  </th>
                  <td>
                    <select className='input' onChange={(event) => storeSettingChanged(event, 'concurrent')}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Image Url"}
                    />  
                    :
                  </th>
                  <td>
                    <div>
                      <span>{storeData.image_url}</span>
                      <input type='file' ref={fileInputRef} onChange={handleImageUpload} className='image-uploader'/>
                      <FontAwesomeIcon icon={faUpload} onClick={openFilePicker} className='image-uploader'/>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Visibility"}
                    />
                    :
                  </th>
                  <td>
                    {storeData.status == 0 && (
                      <Translator
                        code={language}
                        value={"Under review"}
                        classNames={"orange"}
                      />
                    )}
                    {storeData.status == 1 && (
                      <Translator
                        code={language}
                        value={"Active"}
                        classNames={"green"}
                      />
                    )}
                    {storeData.status == 2 && (
                      <Translator
                        code={language}
                        value={"Inactive"}
                        classNames={"red"}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={"Subscription Status"}
                    />
                    :
                  </th>
                  <td>
                    {subscriptionStatus ? (
                      <Translator
                        code={language}
                        value={"Active"}
                        classNames={"value green"}
                      />
                    ) : (
                      <Translator
                        code={language}
                        value={"Inactive"}
                        classNames={"value red"}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <SubscriptionPortal
              GlobalState={GlobalState}
            />
          </div>
          <div className='settings-section'>
            <h2>
              <Translator
                code={language}
                value={`Services`}
              />
            </h2>
            <table className='row-based'>
              <thead>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={`Title`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Description`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Duration`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Concurrent`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Price`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`List Price`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Independent`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Auto Accept`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Can Combine`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Can Not Combine`}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {storeServicesData.map((service,index) => (
                  service.status!=2 && (
                    <tr key={index} className={service.status === 0 ? 'disabled-row' : ''}>
                      <td>
                        <input 
                          type="text"
                          className='input'
                          defaultValue={service.title}
                          onBlur={(event) => serviceRowChanged(index, event, 'title')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          className='input'
                          defaultValue={service.description}
                          onBlur={(event) => serviceRowChanged(index, event, 'description')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          className='input two-digit'
                          defaultValue={service.duration}
                          onBlur={(event) => serviceRowChanged(index, event, 'duration')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          className='input two-digit'
                          defaultValue={service.concurrent}
                          onBlur={(event) => serviceRowChanged(index, event, 'concurrent')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          className='input two-digit'
                          defaultValue={service.price}
                          onBlur={(event) => serviceRowChanged(index, event, 'price')}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          className='input two-digit'
                          defaultValue={service.list_price}
                          onBlur={(event) => serviceRowChanged(index, event, 'list_price')}
                        />
                      </td>
                      <td>
                        <select className='input two-digit' defaultValue={service.independent} onChange={(event) => serviceRowChanged(index, event, 'independent')}>
                          <option value="0">
                            {Translator({code:language,value:`No`}).props.children}
                          </option>
                          <option value="1">
                            {Translator({code:language,value:`Yes`}).props.children}
                          </option>
                        </select>
                      </td>
                      <td>
                        <select className='input two-digit' defaultValue={service.auto_accept} onChange={(event) => serviceRowChanged(index, event, 'auto_accept')}>
                          <option value="0" >
                            {Translator({code:language,value:`No`}).props.children}
                          </option>
                          <option value="1">
                            {Translator({code:language,value:`Yes`}).props.children}
                          </option>
                        </select>
                      </td>
                      <td>
                        <select multiple className='input' defaultValue={service.can_combine_with_ids.split('_')} onChange={(event) => serviceRowChanged(index, event, 'can_combine_with_ids')}>
                          {storeServicesData.map((serviceCombination,index) => (
                            ((service.id != serviceCombination.id) && serviceCombination.status!=2) && (
                              <option key={index} value={serviceCombination.id}>
                                {serviceCombination.title}
                              </option>
                            )
                          ))}
                        </select>
                      </td>
                      <td>
                        <select multiple className='input' defaultValue={service.can_not_combine_with_ids.split('_')} onChange={(event) => serviceRowChanged(index, event, 'can_not_combine_with_ids')}>
                          {storeServicesData.map((serviceCombination,index) => (
                            ((service.id != serviceCombination.id) && serviceCombination.status!=2) && (
                              <option key={index} value={serviceCombination.id}>
                                {serviceCombination.title}
                              </option>
                            )
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className='disable-row' onClick={() => disableServiceRow(index)}>
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                      </td>
                      <td>
                        <button className='remove-row' onClick={() => removeServiceRow(index)}>
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
            <div className='buttons'>
              <button className='button' onClick={() => addServiceRow()}>
                <Translator
                  code={language}
                  value={`Add new`}
                />
              </button>
              <button className='button' onClick={() => saveServices()}>
                <Translator
                  code={language}
                  value={`Save`}
                />
              </button>
            </div>
          </div>
          <div className='settings-section'>
            <h2>
              <Translator
                code={language}
                value={`Working Hours`}
              />
            </h2>
            <table className='row-based'>
              <thead>
                <tr>
                  <th>
                    <Translator
                      code={language}
                      value={`Day`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`Start time`}
                    />
                  </th>
                  <th>
                    <Translator
                      code={language}
                      value={`End time`}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {storeWorkingHoursData.map((workingHour,index) => (
                  workingHour.status!=2 && (
                    <tr key={index} className={workingHour.status === 0 ? 'disabled-row' : ''}>
                      <td>
                        <select className='input' defaultValue={workingHour.day} onChange={(event) => workingHourRowChanged(index, event, 'day')}>
                          <option value="1">
                            {Translator({code:language,value:`Monday`}).props.children}
                          </option>
                          <option value="2">
                            {Translator({code:language,value:`Tuesday`}).props.children}
                          </option>
                          <option value="3">
                            {Translator({code:language,value:`Wednesday`}).props.children}
                          </option>
                          <option value="4">
                            {Translator({code:language,value:`Thursday`}).props.children}
                          </option>
                          <option value="5">
                            {Translator({code:language,value:`Friday`}).props.children}
                          </option>
                          <option value="6">
                            {Translator({code:language,value:`Saturday`}).props.children}
                          </option>
                          <option value="7">
                            {Translator({code:language,value:`Sunday`}).props.children}
                          </option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="time"
                          className='input'
                          defaultValue={workingHour.start_time}
                          onBlur={(event) => workingHourRowChanged(index, event, 'start_time')}
                        />
                      </td>
                      <td>
                        <input 
                          type="time"
                          className='input'
                          defaultValue={workingHour.end_time}
                          onBlur={(event) => workingHourRowChanged(index, event, 'end_time')}
                        />
                      </td>
                      <td>
                        <button className='disable-row' onClick={() => disableWorkingHourRow(index)}>
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                      </td>
                      <td>
                        <button className='remove-row' onClick={() => removeWorkingHourRow(index)}>
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
            <div className='buttons'>
              <button className='button' onClick={addWorkingHourRow}>
                <Translator
                  code={language}
                  value={`Add new`}
                />
              </button>
              <button className='button' onClick={() => saveWorkingHours()}>
                <Translator
                  code={language}
                  value={`Save`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default StoreSettings
