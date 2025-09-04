// Brand Update System - Component-level brand management and updates
// Provides centralized control over brand elements with change tracking

import React, { createContext, useContext, useState, useEffect } from 'react';
import { brandTestingFramework } from './brand-testing-framework';

export interface BrandElement {
  id: string;
  type: 'color' | 'typography' | 'messaging' | 'imagery' | 'tone' | 'value';
  category: string;
  name: string;
  current_value: any;
  test_variants?: any[];
  last_updated: Date;
  updated_by: string;
  change_reason: string;
  performance_data?: {
    effectiveness_score: number;
    usage_frequency: number;
    audience_response: number;
  };
}

export interface BrandUpdate {
  id: string;
  element_id: string;
  old_value: any;
  new_value: any;
  change_type: 'test' | 'optimization' | 'refresh' | 'correction';
  timestamp: Date;
  author: string;
  description: string;
  affected_components: string[];
  approval_status: 'pending' | 'approved' | 'rejected';
  rollback_available: boolean;
}

export interface ComponentBrandMapping {
  component_name: string;
  brand_elements: {
    element_id: string;
    usage_context: string;
    override_values?: any;
    custom_variants?: any[];
  }[];
  last_audit: Date;
  compliance_score: number;
}

interface BrandUpdateContextType {
  brandElements: BrandElement[];
  pendingUpdates: BrandUpdate[];
  componentMappings: ComponentBrandMapping[];
  updateBrandElement: (elementId: string, newValue: any, reason: string) => Promise<void>;
  createTestVariant: (elementId: string, variantValue: any, testName: string) => Promise<void>;
  rollbackUpdate: (updateId: string) => Promise<void>;
  auditComponent: (componentName: string) => Promise<ComponentBrandMapping>;
  getBrandElementValue: (elementId: string, componentContext?: string) => any;
  trackBrandUsage: (elementId: string, componentName: string) => void;
}

const BrandUpdateContext = createContext<BrandUpdateContextType | null>(null);

export const useBrandUpdate = () => {
  const context = useContext(BrandUpdateContext);
  if (!context) {
    throw new Error('useBrandUpdate must be used within BrandUpdateProvider');
  }
  return context;
};

export const BrandUpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandElements, setBrandElements] = useState<BrandElement[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<BrandUpdate[]>([]);
  const [componentMappings, setComponentMappings] = useState<ComponentBrandMapping[]>([]);

  useEffect(() => {
    initializeBrandElements();
    loadComponentMappings();
  }, []);

  const initializeBrandElements = async () => {
    // Initialize with current brand guide elements
    const elements: BrandElement[] = [
      // Colors
      {
        id: 'primary_color',
        type: 'color',
        category: 'colors',
        name: 'Primary Brand Color',
        current_value: '#73582c', // Heritage Brown
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      {
        id: 'secondary_color',
        type: 'color',
        category: 'colors',
        name: 'Secondary Brand Color',
        current_value: '#d4af37', // Achievement Gold
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      {
        id: 'accent_color',
        type: 'color',
        category: 'colors',
        name: 'Accent Brand Color',
        current_value: '#0288d1', // Journey Blue
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      
      // Typography
      {
        id: 'primary_font',
        type: 'typography',
        category: 'fonts',
        name: 'Primary Font Family',
        current_value: 'Inter, sans-serif',
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      {
        id: 'heading_weight',
        type: 'typography',
        category: 'fonts',
        name: 'Heading Font Weight',
        current_value: '600',
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      
      // Messaging
      {
        id: 'primary_tagline',
        type: 'messaging',
        category: 'taglines',
        name: 'Primary Tagline',
        current_value: 'Transforming lives through community-led employment pathways',
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      {
        id: 'value_proposition',
        type: 'messaging',
        category: 'core_messages',
        name: 'Core Value Proposition',
        current_value: 'We see potential first, building on cultural strength to achieve commercial excellence through reciprocity and transformation.',
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      
      // Brand Values
      {
        id: 'potential_first',
        type: 'value',
        category: 'brand_dna',
        name: 'Potential First',
        current_value: {
          description: 'We see the potential in every person and situation before we see the problems',
          keywords: ['potential', 'possibility', 'capability', 'opportunity'],
          messaging_tone: 'optimistic, forward-looking, empowering'
        },
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      },
      {
        id: 'cultural_strength',
        type: 'value',
        category: 'brand_dna',
        name: 'Cultural Strength',
        current_value: {
          description: 'Cultural identity and knowledge as foundational strengths, not barriers to overcome',
          keywords: ['culture', 'indigenous', 'traditional', 'community', 'identity'],
          messaging_tone: 'respectful, proud, grounded'
        },
        last_updated: new Date(),
        updated_by: 'Brand System',
        change_reason: 'Initial brand guide implementation'
      }
    ];

    setBrandElements(elements);
  };

  const loadComponentMappings = async () => {
    // Initialize component mappings for major components
    const mappings: ComponentBrandMapping[] = [
      {
        component_name: 'Navigation',
        brand_elements: [
          { element_id: 'primary_color', usage_context: 'background_color' },
          { element_id: 'primary_font', usage_context: 'font_family' }
        ],
        last_audit: new Date(),
        compliance_score: 95
      },
      {
        component_name: 'HomePage',
        brand_elements: [
          { element_id: 'primary_tagline', usage_context: 'hero_tagline' },
          { element_id: 'value_proposition', usage_context: 'hero_description' },
          { element_id: 'primary_color', usage_context: 'cta_background' },
          { element_id: 'secondary_color', usage_context: 'accent_elements' }
        ],
        last_audit: new Date(),
        compliance_score: 88
      },
      {
        component_name: 'BrandGuidePage',
        brand_elements: [
          { element_id: 'potential_first', usage_context: 'brand_value_description' },
          { element_id: 'cultural_strength', usage_context: 'brand_value_description' },
          { element_id: 'primary_color', usage_context: 'color_showcase' },
          { element_id: 'secondary_color', usage_context: 'color_showcase' }
        ],
        last_audit: new Date(),
        compliance_score: 92
      }
    ];

    setComponentMappings(mappings);
  };

  const updateBrandElement = async (elementId: string, newValue: any, reason: string) => {
    const element = brandElements.find(e => e.id === elementId);
    if (!element) {
      throw new Error(`Brand element ${elementId} not found`);
    }

    // Create update record
    const update: BrandUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      element_id: elementId,
      old_value: element.current_value,
      new_value: newValue,
      change_type: 'optimization',
      timestamp: new Date(),
      author: 'Brand Manager', // In production, get from auth context
      description: reason,
      affected_components: getAffectedComponents(elementId),
      approval_status: 'pending',
      rollback_available: true
    };

    setPendingUpdates(prev => [...prev, update]);

    // Auto-approve for now (in production, implement approval workflow)
    await approveUpdate(update.id);
  };

  const approveUpdate = async (updateId: string) => {
    const update = pendingUpdates.find(u => u.id === updateId);
    if (!update) return;

    // Apply the update
    setBrandElements(prev => prev.map(element => 
      element.id === update.element_id 
        ? {
            ...element,
            current_value: update.new_value,
            last_updated: new Date(),
            updated_by: update.author,
            change_reason: update.description
          }
        : element
    ));

    // Update pending status
    setPendingUpdates(prev => prev.map(u => 
      u.id === updateId 
        ? { ...u, approval_status: 'approved' as const }
        : u
    ));

    // Notify affected components (in production, trigger re-renders)
    console.log(`Brand update approved: ${update.element_id} updated in components:`, update.affected_components);
  };

  const createTestVariant = async (elementId: string, variantValue: any, testName: string): Promise<void> => {
    const element = brandElements.find(e => e.id === elementId);
    if (!element) {
      throw new Error(`Brand element ${elementId} not found`);
    }

    // Create test variant through brand testing framework
    const testVariant = await brandTestingFramework.createTestVariant(
      testName,
      `Testing variant for ${element.name}`,
      { key_messages: [JSON.stringify(variantValue)] },
      ['community', 'partners'] // Default test audiences
    );

    // Update element with test variant
    setBrandElements(prev => prev.map(e => 
      e.id === elementId 
        ? {
            ...e,
            test_variants: [
              ...(e.test_variants || []),
              {
                id: testVariant.id,
                value: variantValue,
                test_name: testName,
                created_date: new Date()
              }
            ]
          }
        : e
    ));

    return testVariant.id;
  };

  const rollbackUpdate = async (updateId: string) => {
    const update = pendingUpdates.find(u => u.id === updateId);
    if (!update || !update.rollback_available) {
      throw new Error('Update cannot be rolled back');
    }

    // Rollback to previous value
    setBrandElements(prev => prev.map(element => 
      element.id === update.element_id 
        ? {
            ...element,
            current_value: update.old_value,
            last_updated: new Date(),
            updated_by: 'System Rollback',
            change_reason: `Rollback of update: ${update.description}`
          }
        : element
    ));

    console.log(`Rolled back update ${updateId} for element ${update.element_id}`);
  };

  const auditComponent = async (componentName: string): Promise<ComponentBrandMapping> => {
    const mapping = componentMappings.find(m => m.component_name === componentName);
    if (!mapping) {
      // Create new mapping for untracked component
      const newMapping: ComponentBrandMapping = {
        component_name: componentName,
        brand_elements: [],
        last_audit: new Date(),
        compliance_score: 0
      };
      setComponentMappings(prev => [...prev, newMapping]);
      return newMapping;
    }

    // Update audit timestamp and recalculate compliance
    const updatedMapping = {
      ...mapping,
      last_audit: new Date(),
      compliance_score: calculateComplianceScore(mapping)
    };

    setComponentMappings(prev => prev.map(m => 
      m.component_name === componentName ? updatedMapping : m
    ));

    return updatedMapping;
  };

  const getBrandElementValue = (elementId: string, componentContext?: string) => {
    const element = brandElements.find(e => e.id === elementId);
    if (!element) {
      console.warn(`Brand element ${elementId} not found`);
      return null;
    }

    // Check for component-specific overrides
    if (componentContext) {
      const mapping = componentMappings.find(m => m.component_name === componentContext);
      const elementMapping = mapping?.brand_elements.find(e => e.element_id === elementId);
      
      if (elementMapping?.override_values) {
        return elementMapping.override_values;
      }
    }

    return element.current_value;
  };

  const trackBrandUsage = (elementId: string, componentName: string) => {
    // Track usage for analytics (in production, send to analytics service)
    console.log(`Brand element ${elementId} used in ${componentName}`);
    
    // Update performance data
    setBrandElements(prev => prev.map(element => 
      element.id === elementId 
        ? {
            ...element,
            performance_data: {
              effectiveness_score: element.performance_data?.effectiveness_score || 0,
              usage_frequency: (element.performance_data?.usage_frequency || 0) + 1,
              audience_response: element.performance_data?.audience_response || 0
            }
          }
        : element
    ));
  };

  // Helper functions
  const getAffectedComponents = (elementId: string): string[] => {
    return componentMappings
      .filter(mapping => mapping.brand_elements.some(e => e.element_id === elementId))
      .map(mapping => mapping.component_name);
  };

  const calculateComplianceScore = (mapping: ComponentBrandMapping): number => {
    // Calculate how well the component adheres to brand guidelines
    const totalElements = mapping.brand_elements.length;
    if (totalElements === 0) return 0;

    // Check for proper usage, no overrides without justification, etc.
    const compliantElements = mapping.brand_elements.filter(element => {
      const brandElement = brandElements.find(be => be.id === element.element_id);
      return brandElement && !element.override_values; // Simplified check
    }).length;

    return Math.round((compliantElements / totalElements) * 100);
  };

  const contextValue: BrandUpdateContextType = {
    brandElements,
    pendingUpdates,
    componentMappings,
    updateBrandElement,
    createTestVariant,
    rollbackUpdate,
    auditComponent,
    getBrandElementValue,
    trackBrandUsage
  };

  return (
    <BrandUpdateContext.Provider value={contextValue}>
      {children}
    </BrandUpdateContext.Provider>
  );
};

// Hook for components to easily access brand values
export const useBrandElement = (elementId: string, componentName?: string) => {
  const { getBrandElementValue, trackBrandUsage } = useBrandUpdate();
  
  useEffect(() => {
    if (componentName) {
      trackBrandUsage(elementId, componentName);
    }
  }, [elementId, componentName, trackBrandUsage]);

  return getBrandElementValue(elementId, componentName);
};

// Higher-order component for automatic brand compliance
export const withBrandCompliance = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { auditComponent } = useBrandUpdate();
    
    useEffect(() => {
      auditComponent(componentName);
    }, [auditComponent]);

    return <WrappedComponent {...(props as any)} ref={ref} />;
  });
};