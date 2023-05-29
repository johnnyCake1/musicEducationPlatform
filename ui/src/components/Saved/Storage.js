import TabbedPage from "../common/TabbedPage";
import SavedItemsPreviewCard from "./components/SavedItemsPreviewCard";

const Storage = () => {
  const documents = [
    {
      id: 1,
      type: "pdf",
      title: "My great pdf file",
      updatedAt: "2023-05-15",
      size: "4.5MB",
      imageSrc: "https://via.placeholder.com/320x180.png?text=PDF",
    },
    {
      id: 2,
      type: "word",
      title: "My notes",
      updatedAt: "2023-05-12",
      size: "3.2MB",
      imageSrc: "https://via.placeholder.com/320x180.png?text=Note",
    },
    {
      id: 3,
      type: "powerpoint",
      title: "Cool picture",
      updatedAt: "2023-05-10",
      size: "7.8MB",
      imageSrc: "https://via.placeholder.com/320x180.png?text=PNG",
    },
  ];
  const tabs = [
    {
      name: "storage",
      label: "Storage (all)",
      content:
        documents.length > 0 ? (
          <div className="my-cards-grid">
            {documents.map((document) => (
              <SavedItemsPreviewCard key={document.id} {...document} />
            ))}
          </div>
        ) : (
          <div>{"Nothing in your wishlist yet :("}</div>
        ),
    },
  ];
  return(
    <div className="container">
      <div className="text-2xl font-semibold"> Storage </div>
      <TabbedPage tabs={tabs} />
    </div>
  )
};

export default Storage;
