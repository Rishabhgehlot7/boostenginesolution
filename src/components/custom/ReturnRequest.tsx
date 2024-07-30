import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";

interface ReturnRequestProps {
  orderId: string;
  orderDate: string; // Date when the order was placed
}

const ReturnRequest: React.FC<ReturnRequestProps> = ({
  orderId,
  orderDate,
}) => {
  const [returnReason, setReturnReason] = useState("");
  const [buttonClick, setButtonClick] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [status, setStatus] = useState("Return");
  const { toast } = useToast();

  // Calculate if the order is within the last 7 days
  const isWithinSevenDays = () => {
    const orderDateObj = new Date(orderDate);
    const currentDate = new Date();
    const sevenDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 7)
    );
    return orderDateObj >= sevenDaysAgo;
  };

  const handleReturnRequest = async () => {
    try {
      const response = await axios.post(`/api/returnOrder/${orderId}`, {
        returnReason,
      });

      console.log("Return request submitted:", response.data);
      setButtonClick(false);
      setButtonDisabled(true);
      toast({
        title: "Return Request Submitted",
        description: "Your return request has been successfully submitted.",
      });
      setStatus("Returned");
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast({
        title: "Failed to Submit Return Request",
        description: "An error occurred while submitting your return request.",
        variant: "destructive",
      });
    }
  };

  if (!isWithinSevenDays()) {
    return <p>Return request period has expired.</p>;
  }

  if (!buttonClick) {
    return (
      <div>
        <Button
          onClick={() => setButtonClick(true)}
          disabled={buttonDisabled}
          className=" my-2"
        >
          {status}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Request a Return</h2>
      <Textarea
        placeholder="Enter the reason for the return"
        value={returnReason}
        onChange={(e) => setReturnReason(e.target.value)}
        className="mb-2 text-white bg-black"
      />
      <Button onClick={handleReturnRequest}>Submit Return Request</Button>
    </div>
  );
};

export default ReturnRequest;
