import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData]= useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async(event) =>{
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find(product => product._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const res = await axios.post(backendUrl + "/api/order/place", orderData, {
            headers: { token },
          });
          console.log(res.data);
          
          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message)
          }
          break;

        case "stripe":
          const resStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}})
          if(resStripe.data.success){
            const {session_url} = resStripe.data
            window.location.replace(session_url)
          }else{
            toast.error(resStripe.data.message)
          }

          break;
        default:
          break;
      }
      
    }catch (error) {
      
    }
  }

  

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* --------------- Left Side ----------------------- */}

      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 ">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex flex-col sm:flex-row  gap-3">
          <input required
            onChange={onChangeHandler} name='firstName' value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input required
            onChange={onChangeHandler} name='lastName' value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input required
          onChange={onChangeHandler} name='email' value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          onChange={onChangeHandler} name='street' value={formData.street}
          type="text"
          placeholder="Street"
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex flex-col sm:flex-row  gap-3">
          <input required
            onChange={onChangeHandler} name='city' value={formData.city}
            type="text"
            placeholder="City"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input required
            onChange={onChangeHandler} name='state' value={formData.state}
            type="text"
            placeholder="State"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row  gap-3">
          <input required
            onChange={onChangeHandler} name='zipcode' value={formData.zipcode}
            type="text"
            placeholder="Zipcode"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input required
            onChange={onChangeHandler} name='country' value={formData.country}
            type="text"
            placeholder="Country"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input required
          onChange={onChangeHandler} name='phone' value={formData.phone}
          type="number"
          placeholder="Phone "
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* --------------- Right Side ----------------------- */}

      <div className="mt-8">
        <div className="mt8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* -------------- Payment method selection -------------- */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div
              onClick={() => {
                setMethod('stripe');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  method === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setMethod('razorpay');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  method === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setMethod('cod');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                {' '}
                CASH ON DELIVARY
              </p>
            </div>
          </div>

          {/* -------------- Payment method selection -------------- */}

          <div className="w-full text-end mt-8">
            <button
              type='submit'
              
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
