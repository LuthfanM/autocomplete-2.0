import Head from "next/head";
import CustomCard from "@/components/Cards";
import Dropdown from "@/components/Dropdown";
import { dataExample } from "@/helpers";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingData, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/getDataSource`);
      if (!response.ok) {
        throw new Error("Network Error");
      }
      const responseData = await response.json();
      setData(responseData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Auto Complete</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen items-center justify-center">
        <CustomCard>
          {/* <Dropdown title="Async Search" data={dataExample} disabled={false} /> */}
          <Dropdown
            title="AutoComplete Dropdown"
            description="Type to begin searching"
            data={data || []}
            loading={loadingData}
            width={250}
            onChangeText={() => {
              fetchData();
            }}
            async={true}
            disabled={false}
          />
        </CustomCard>
        <CustomCard>
          <Dropdown
            title="AutoComplete Dropdown (Synchronous)"
            description="Press to open data list"
            data={dataExample || []}
            loading={loadingData}
            width={300}
            disabled={false}
          />
        </CustomCard>
      </div>
    </>
  );
}
