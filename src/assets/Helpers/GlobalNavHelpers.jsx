export function GlobalGoNext({ list, idName, currentItem, setSelectedItem }) {
  console.log("goNext", list, idName, currentItem, setSelectedItem);
  const currentIndex = list.findIndex(
    (item) => item[idName] === currentItem[idName]
  );
  if (currentIndex < list.length - 1) {
    setSelectedItem(list[currentIndex + 1]);
  }
}

export function GlobalGoPrevious({
  list,
  idName,
  currentItem,
  setSelectedItem,
}) {
  const currentIndex = list.findIndex(
    (item) => item[idName] === currentItem[idName]
  );

  if (currentIndex > 0) {
    setSelectedItem(list[currentIndex - 1]);
  }
  console.log(currentIndex);
}
