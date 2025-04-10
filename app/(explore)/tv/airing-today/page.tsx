import { getAiringTodayTvShows } from "@/lib/api";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "Airing Today Tv Shows | Watchfolio",
  description: "List of tv shows airing today",
};

export default WithPagination(getAiringTodayTvShows);