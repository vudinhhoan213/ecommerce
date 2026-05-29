import React, { Component, ErrorInfo, ReactNode } from "react";
import { Result, Button } from "antd";
import i18n from "../../i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <Result
            status="500"
            title={i18n.t("error.boundary")}
            subTitle={i18n.t("error.subtitle")}
            extra={
              <Button type="primary" onClick={this.handleReload}>
                {i18n.t("error.reload")}
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
