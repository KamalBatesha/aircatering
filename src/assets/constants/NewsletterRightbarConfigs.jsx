import { format } from "date-fns";

export const getNewsletterRightBarHeaderConfig = (campaign) => {
  if (!campaign) return {};
  return {
    title: campaign.newsLetterName || "Untitled Campaign",
    id: `ID: ${campaign.newsLetterId}`,
    status: campaign.status || "Draft",
    createdDate: campaign.newsLetterCreatedDate
      ? format(new Date(campaign.newsLetterCreatedDate), "PPP")
      : "N/A",
  };
};

export const getNewsletterRightBarFooterConfig = (campaign) => {
  return {}; // No footer for now
};

export const getNewsletterTabs = (campaign) => {
  if (!campaign) return [];
  return [
    {
      label: "Details",
      key: "details",
      children: (
        <div style={{ padding: "1rem" }}>
          <p>
            <strong>Subject:</strong> {campaign.newsLetterSubject || "N/A"}
          </p>
          <p>
            <strong>Sender Name:</strong>{" "}
            {campaign.newsLetterSenderName || "N/A"}
          </p>
          <p>
            <strong>Sender Email:</strong>{" "}
            {campaign.newsLetterSenderMail || "N/A"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {campaign.newsLetterCreatedDate
              ? format(new Date(campaign.newsLetterCreatedDate), "PPP p")
              : "N/A"}
          </p>
          {campaign.newsLetterDateToSend && (
            <p>
              <strong>Scheduled For:</strong>{" "}
              {format(new Date(campaign.newsLetterDateToSend), "PPP p")}
            </p>
          )}
        </div>
      ),
    },
    // Add Statistics or Recipient summary here later
  ];
};
