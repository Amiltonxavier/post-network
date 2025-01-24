import { queryClient } from "@/lib/react-query";
import { QueryClientProvider} from "@tanstack/react-query";


export function QueryProvider(props:React.PropsWithChildren) {
  
  return <QueryClientProvider client={queryClient} {...props}/>;
}
