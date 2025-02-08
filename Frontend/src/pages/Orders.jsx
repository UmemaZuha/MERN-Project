import { useContext, useEffect } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const { backendUrl,token, currency } = useContext(ShopContext);
  const [orderData, setorderData] = useState([])
  
  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Get the current date
  const currentDate = formatDate(new Date());

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const res = await axios.post(backendUrl + "/api/order/user-orders",{} ,{
        headers: { token },
      });
      console.log(res.data);
      

      if (res.data.success) {
        let allOrderItems = [];
        res.data.orders.map((order) => {
          order.items.map((item) => {
            
              item["status"] = order.status;
              item["payment"] = order.payment;
              item["paymentMethod"] = order.paymentMethod;
              item["date"] = order.date;
              allOrderItems.push(item);
            
          });
        });
        setorderData(allOrderItems.reverse());
        

        
      } 
    }catch (error) {
      console.log(error);
      
    }
  };

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className="pt-16 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      { 
        <div>
          {orderData.map((order, index) =>

            
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between g4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={order.image[0]}
                    alt=""
                    className="w-16 sm:w-20"
                  />

                  <div>
                    <p className="sm:text-base font-medium">
                      {order.name}
                    </p>

                    <div className="flex items-center gap-5 mt-2 text-base text-gray-700">
                      <p>
                        {currency}
                        {order.price}
                      </p>
                      <p>Quantity: {order.quantity}</p>
                      <p>Size: {order.size}</p>
                    </div>
                    <p className="mt-1">
                      Date: <span className="text-gray-400">{currentDate}</span>
                    </p>
                    <p className="mt-1">
                      Payment: <span className="text-gray-400">{order.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-400"></p>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>
                  <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm text-gray-700">
                    Track Order
                  </button>
                </div>
              </div>
          )
          }
        </div>
      }
    </div>
  )
};

export default Orders;