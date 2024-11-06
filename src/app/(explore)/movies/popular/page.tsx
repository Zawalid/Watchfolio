import { getPopularMovies } from "@/lib/TMDB";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "Popular Movies",
  description: "List of popular movies",
};

export default WithPagination(getPopularMovies);