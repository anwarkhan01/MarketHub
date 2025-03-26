import React, {useState, useEffect} from "react";

const ServiceProviderList = () => {
  //   const [providers, setProviders] = useState([]);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/user/search/service-provider?profession=plumber`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          const data = await response.json();
          console.error("dataaaaa", data);
          return;
        }
        const data = await response.json();
        console.log("real dataaaaa", data);
      } catch (err) {
        console.error("Error fetching providerssss:", err.message);
      }
    }
    fetchProviders();
  }, []);

  return (
    // <div>
    //   {/* <h2 className="text-2xl mb-4">Available Service Providers</h2>
    //   <div className="space-y-4">
    //     {providers.map((provider) => (
    //       <div key={provider._id} className="border p-4 rounded-md shadow-md">
    //         <h3 className="text-xl">{provider.name}</h3>
    //         <p className="text-sm text-gray-600">{provider.profession}</p>
    //         <button className="mt-2 bg-green-500 text-white p-2 rounded-md">
    //           Request Service
    //         </button>
    //       </div>
    //     ))}
    //   </div> */}
    // </div>
    <></>
  );
};

export default ServiceProviderList;
