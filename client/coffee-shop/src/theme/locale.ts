export const viVN = {
  props: {
    MuiTablePagination: {
      backIconButtonText: "Trang trước",
      labelRowsPerPage: "Số dòng trên trang:",
      labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
        `${from}-${to === -1 ? count : to} của ${count}`,
      nextIconButtonText: "Trang sau",
    },
    MuiRating: {
      getLabelText: (value: number) => `${value} Star${value !== 1 ? "s" : ""}`,
    },
    MuiAutocomplete: {
      clearText: "Xóa",
      closeText: "Đóng",
      loadingText: "Đang tải...",
      noOptionsText: "không có kết quả phù hợp",
      openText: "Mở",
    },
  },
};
