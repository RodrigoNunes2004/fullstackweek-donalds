import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const HomPage = () => {
  return (
    <div className="p-5 border border-red-500 rounded-xl"> 
  <h1 className="text-red-500">Hello world</h1>
  <br />
  <Button >Click me</Button>
  <br />
  <Input placeholder="Enter your name" />
  </div>
);
}
 
export default HomPage;