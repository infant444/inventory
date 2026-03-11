/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, Download } from "lucide-react";
import { itemAPI } from "../services/api";
import { useLoading } from "../context/LoadingContext";
import { toast } from "react-toastify";

interface GroupedItem {
  groupName: string;
  totalQuantity: number;
  baseUnit: string;
  items: any[];
}

const GroupedProducts: React.FC = () => {
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchAndGroupItems();
  }, []);

  const convertToBaseUnit = (quantity: number, unit: string): { value: number; baseUnit: string } => {
    const lowerUnit = unit.toLowerCase();
    
    if (lowerUnit === "kilogram") return { value: quantity * 1000, baseUnit: "gram" };
    if (lowerUnit === "liter") return { value: quantity * 1000, baseUnit: "milliliter" };
    if (lowerUnit === "gram") return { value: quantity, baseUnit: "gram" };
    if (lowerUnit === "milliliter") return { value: quantity, baseUnit: "milliliter" };
    if (lowerUnit === "milligram") return { value: quantity / 1000, baseUnit: "gram" };
    if (lowerUnit === "bottle" || lowerUnit === "can") return { value: quantity, baseUnit: lowerUnit };
    
    return { value: quantity, baseUnit: unit };
  };

  const formatQuantity = (quantity: number, unit: string): string => {
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit === "gram" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(2)} kg`;
    }
    if (lowerUnit === "milliliter" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(2)} L`;
    }
    return `${quantity.toFixed(2)} ${unit}`;
  };

  const getSmallestUnit = (units: string[]): string => {
    const lowerUnits = units.map(u => u.toLowerCase());
    if (lowerUnits.includes("gram") || lowerUnits.includes("milligram")) return "gram";
    if (lowerUnits.includes("kilogram")) return "gram";
    if (lowerUnits.includes("milliliter")) return "milliliter";
    if (lowerUnits.includes("liter")) return "milliliter";
    return units[0];
  };

  const fetchAndGroupItems = async () => {
    showLoading("Loading grouped products...");
    try {
      const response = await itemAPI.getItems();
      const items = response.data;
      console.log("All items:", items);

      const grouped: { [key: string]: GroupedItem } = {};

      items.forEach((item: any) => {
        console.log("Item:", item.itemName, "GroupName:", item.groupName, "Group:", item.group);
        if (!item.groupName || !item.group?.typeName) return;
        
        const groupKey = item.groupName;

        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            groupName: item.group.typeName,
            totalQuantity: 0,
            baseUnit: "",
            items: [],
          };
        }

        grouped[groupKey].items.push(item);
      });

      console.log("Grouped before calculation:", grouped);

      Object.values(grouped).forEach((group) => {
        const units = group.items.map((item: any) => item.quantityType);
        const smallestUnit = getSmallestUnit(units);
        group.baseUnit = smallestUnit;

        group.totalQuantity = group.items.reduce((sum, item: any) => {
          const actualQty = parseFloat(item.currentQty) * (item.packQty ? parseFloat(item.packQty) : 1);
          const converted = convertToBaseUnit(actualQty, item.quantityType);
          if (converted.baseUnit === smallestUnit) {
            return sum + converted.value;
          }
          return sum;
        }, 0);
      });

      const sortedGroups = Object.values(grouped).sort((a, b) =>
        a.groupName.localeCompare(b.groupName)
      );

      console.log("Final sorted groups:", sortedGroups);
      setGroupedItems(sortedGroups);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load grouped products");
    } finally {
      hideLoading();
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const downloadCSV = () => {
    if (groupedItems.length === 0) {
      toast.error("No data to download");
      return;
    }

    let csvContent = "";

    groupedItems.forEach((group) => {
      csvContent += `"${group.groupName}","Total: ${formatQuantity(group.totalQuantity, group.baseUnit)}","${group.items.length} items"\n`;
      csvContent += "Item Code,Item Name,Pack Qty,Current Qty,Total Quantity,Supplier,Category\n";
      
      group.items.forEach((item: any) => {
        const totalQty = parseFloat(item.currentQty) * (item.packQty ? parseFloat(item.packQty) : 1);
        csvContent += `"${item.itemCode}","${item.itemName}","${item.packQty} ${item.quantityType}","${item.currentQty} units","${formatQuantity(totalQty, item.quantityType)}","${item.supplier?.supplierName || '-'}","${item.category?.typeName || '-'}"\n`;
      });
      
      csvContent += "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `grouped-products-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV downloaded successfully");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Grouped Products</h1>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Download size={20} />
          Download CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {groupedItems.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Grouped Products Yet
            </h2>
            <p className="text-gray-600">Add items with groups to see grouped products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Group Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groupedItems.map((group, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {group.groupName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatQuantity(group.totalQuantity, group.baseUnit)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {group.items.length} item(s)
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleGroup(group.groupName)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                          {expandedGroups.has(group.groupName) ? (
                            <>
                              <ChevronUp size={16} />
                              <span className="text-xs">Hide</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              <span className="text-xs">Show</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedGroups.has(group.groupName) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Items in this group:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {group.items.map((item: any) => (
                                <div
                                  key={item.itemId}
                                  className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{item.itemName}</p>
                                      <p className="text-xs text-gray-500">{item.itemCode}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-600">Quantity:</span>
                                      <span className="font-medium text-gray-900">
                                        {formatQuantity(parseFloat(item.currentQty) * (item.packQty ? parseFloat(item.packQty) : 1), item.quantityType)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-600">Pack Unit:</span>
                                      <span className="font-medium text-gray-900 capitalize">{`${item.packQty} ${item.quantityType}`}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-600">Current Quantity:</span>
                                      <span className="font-medium text-gray-900 capitalize">{`${item.currentQty} units`}</span>
                                    </div>
                                    {item.supplier && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Supplier:</span>
                                        <span className="font-medium text-gray-900">{item.supplier.supplierName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupedProducts;
