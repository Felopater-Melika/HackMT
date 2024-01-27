export interface FormDataType {
  docType: string;
  boundingRegions: {
    pageNumber: number;
    polygon: {
      x: number;
      y: number;
    }[];
  }[];
  spans: {
    offset: number;
    length: number;
  }[];
  fields: {
    BillingAddress: {
      kind: string;
      value: {
        houseNumber: string;
        road: string;
        city: string;
        state: string;
        postalCode: string;
        streetAddress: string;
      };
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    BillingAddressRecipient: {
      kind: string;
      value: string;
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    CustomerName: {
      kind: string;
      value: string;
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    InvoiceDate: {
      kind: string;
      value: string;
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    InvoiceId: {
      kind: string;
      value: string;
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    InvoiceTotal: {
      kind: string;
      value: {
        amount: number;
        currencySymbol: string;
        currencyCode: string;
      };
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    Items: {
      kind: string;
      values: {
        kind: string;
        properties: {
          Amount: {
            kind: string;
            value: {
              amount: number;
              currencySymbol: string;
              currencyCode: string;
            };
            boundingRegions: {
              pageNumber: number;
              polygon: {
                x: number;
                y: number;
              }[];
            }[];
            content: string;
            spans: {
              offset: number;
              length: number;
            }[];
            confidence: number;
          };
          Description: {
            kind: string;
            value: string;
            boundingRegions: {
              pageNumber: number;
              polygon: {
                x: number;
                y: number;
              }[];
            }[];
            content: string;
            spans: {
              offset: number;
              length: number;
            }[];
            confidence: number;
          };
          Quantity: {
            kind: string;
            value: number;
            boundingRegions: {
              pageNumber: number;
              polygon: {
                x: number;
                y: number;
              }[];
            }[];
            content: string;
            spans: {
              offset: number;
              length: number;
            }[];
            confidence: number;
          };
          UnitPrice: {
            kind: string;
            value: {
              amount: number;
              currencySymbol: string;
              currencyCode: string;
            };
            boundingRegions: {
              pageNumber: number;
              polygon: {
                x: number;
                y: number;
              }[];
            }[];
            content: string;
            spans: {
              offset: number;
              length: number;
            }[];
            confidence: number;
          };
        };
        boundingRegions: {
          pageNumber: number;
          polygon: {
            x: number;
            y: number;
          }[];
        }[];
        content: string;
        spans: {
          offset: number;
          length: number;
        }[];
        confidence: number;
      }[];
    };
    VendorAddress: {
      kind: string;
      value: {
        houseNumber: string;
        road: string;
        city: string;
        state: string;
        postalCode: string;
        streetAddress: string;
      };
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
    VendorName: {
      kind: string;
      value: string;
      boundingRegions: {
        pageNumber: number;
        polygon: {
          x: number;
          y: number;
        }[];
      }[];
      content: string;
      spans: {
        offset: number;
        length: number;
      }[];
      confidence: number;
    };
  };
  confidence: number;
}
