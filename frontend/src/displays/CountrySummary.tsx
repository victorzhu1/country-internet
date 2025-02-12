import { useEffect, useState } from "react";
import { getCountries, getInternetStatistics, updateInternetStatistics } from "../api";
import { Country, InternetStatistics } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function CountrySummary() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [stats, setStats] = useState<InternetStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [newRate, setNewRate] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  const handleCountrySelect = async (code: string) => {
    setSelectedCountry(code);
    setLoading(true);
    try {
      const data = await getInternetStatistics(code);
      setStats(data);
      setNewRate(""); // Reset input on new selection
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!newRate || isNaN(Number(newRate)) || Number(newRate) < 0 || Number(newRate) > 100) {
      alert("Please enter a valid rate between 0 and 100.");
      return;
    }

    try {
      const updatedData = await updateInternetStatistics(selectedCountry, Number(newRate));
      setStats(updatedData);
      alert("Update successful!");
    } catch (error) {
      console.error("Error updating statistics:", error);
      alert("Failed to update data.");
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-xl text-center">Country Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select onValueChange={handleCountrySelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : stats ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country Code</TableHead>
                  <TableHead>WB Rate (%)</TableHead>
                  <TableHead>ITU Rate (%)</TableHead>
                  <TableHead>Users (CIA)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{stats.countryCode}</TableCell>
                  <TableCell>{stats.rate_wb ?? "N/A"}</TableCell>
                  <TableCell>{stats.rate_itu ?? "N/A"}</TableCell>
                  <TableCell>{stats.users_cia?.toLocaleString() ?? "N/A"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex flex-col gap-2 mt-4">
              <Input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Enter new WB rate (0-100)"
                min="0"
                max="100"
              />
              <Button onClick={handleUpdate}>Update Rate</Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a country to view statistics.</p>
        )}
      </CardContent>
    </Card>
  );
}
