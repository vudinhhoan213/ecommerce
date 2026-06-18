import React from "react";
import { TextMb } from "./TextMb";
import styles from "./PageContainer.module.css";

interface PageContainerProps {
  title?: React.ReactNode;
  subtitle?: string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  headerRight,
  footer,
  children,
}) => {
  const showHeader = title || headerRight;

  return (
    <div className={styles.container}>
      {showHeader && (
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            {title && (
              <TextMb variant="heading" className={styles.title}>
                {title}
              </TextMb>
            )}
            {subtitle && (
              <TextMb variant="subtitle" className={styles.subtitle}>
                {subtitle}
              </TextMb>
            )}
          </div>
          {headerRight && (
            <div className={styles.headerRight}>{headerRight}</div>
          )}
        </div>
      )}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default PageContainer;
