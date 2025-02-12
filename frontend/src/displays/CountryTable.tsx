import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { InternetStatistics } from "../types";

interface Props {
  stats: InternetStatistics[];
  loading: boolean;
}

export default function CountryTable({ stats, loading }: Props) {
  return (
    <div className="w-full">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>WB Internet Rate (%)</TableHead>
              <TableHead>Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((country) => (
              <TableRow key={country.countryCode}>
                <TableCell>{country.countryCode}</TableCell>
                <TableCell>{country.rate_wb ?? "N/A"}</TableCell>
                <TableCell>{country.year_wb ?? "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
