import { getOnTheAirTvShows } from "@/lib/api";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "On The Air Tv Shows | Watchfolio",
  description: "List of tv shows currently on the air",
};

export default WithPagination(getOnTheAirTvShows);