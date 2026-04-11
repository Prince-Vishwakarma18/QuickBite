import { IoMdArrowBack } from "react-icons/io";
import { MdStorefront } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function NoShopFound() {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-yellow-50 px-4">
         <div className="relative flex items-center py-4">
            <button
               onClick={() => navigate(-1)}
               className="absolute left-0 text-black cursor-pointer"
            >
               <IoMdArrowBack className="text-2xl" />
            </button>
         </div>
         <div className="flex flex-col items-center justify-center text-center gap-4 h-80">
            <div className="rounded-full bg-amber-50 p-4">
               <MdStorefront className="text-5xl text-amber-400" />
            </div>
            <div className="flex flex-col gap-1.5">
               <p className="text-base font-semibold text-black">
                  No shops near you
               </p>
               <p className="text-[13px] text-zinc-500 max-w-56 leading-relaxed">
                  Looks like we haven't reached your area yet. We're expanding
                  soon!
               </p>
            </div>
            <p className="text-[11px] text-zinc-400">More cities coming soon</p>
         </div>
      </div>
   );
}

export default NoShopFound;
