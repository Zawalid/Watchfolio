import { getAiringTodayTvShows } from "@/lib/TMDB";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "Airing Today TV Shows | Watchfolio",
  description: "List of TV shows airing today",
};

export default WithPagination(getAiringTodayTvShows);