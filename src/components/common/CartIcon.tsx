import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { selectTotalItems } from "../../store/cart";

const CartIcon: React.FC = () => {
  const totalItems = useSelector(selectTotalItems);
  return (
    <Link to="/cart">
      <Badge count={totalItems} size="small" offset={[-2, 2]}>
        <ShoppingCartOutlined style={{ fontSize: 28, color: "#333" }} />
      </Badge>
    </Link>
  );
};

export default CartIcon;
