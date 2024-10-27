import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Home = () => {
  const { data: session } = useSession();
  console.log({ session });

  if (!session) return <Layout />;
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2 className="capitalize">
          Hello, <b>{session?.user?.name}</b>
        </h2>

        <div className="flex bg-gray-300 gap-1 text-black rounded -lg overflow-hidden">
          <Image
            src={session?.user?.image}
            alt={session?.user?.image || "User profile"}
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
