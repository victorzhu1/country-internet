import { useEffect, useState } from "react";
import { getCountries, getInternetStatistics } from "./api";
import { Country, InternetStatistics } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import CountryTable from "./displays/CountryTable";
import CountryPieChart from "./displays/PieChart";
import CountrySummary from "./displays/CountrySummary";

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [stats, setStats] = useState<InternetStatistics[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countryStats, setCountryStats] = useState<InternetStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountriesAndStats() {
      try {
        const countryList = await getCountries();
        setCountries(countryList);

        const data = await Promise.all(
          countryList.map(async (country) => {
            return await getInternetStatistics(country.code);
          })
        );

        const sortedData = data
          .filter((d) => d.rate_wb !== null)
          .sort((a, b) => (b.rate_wb ?? 0) - (a.rate_wb ?? 0));

        setStats(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCountriesAndStats();
  }, []);

  const handleCountrySelect = async (code: string) => {
    setSelectedCountry(code);
    setLoading(true);
    try {
      const data = await getInternetStatistics(code);
      setCountryStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Internet Statistics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="league" className="w-full">
            <TabsList className="flex justify-center">
              <TabsTrigger value="league">Country League Table</TabsTrigger>
              <TabsTrigger value="summary">Country Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="league">
              <CountryTable stats={stats} loading={loading} />
              <CountryPieChart stats={stats} />
            </TabsContent>

            <TabsContent value="summary">
              <CountrySummary />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}