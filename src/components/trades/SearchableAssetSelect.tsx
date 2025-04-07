
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchableAssetSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SearchableAssetSelect: React.FC<SearchableAssetSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure assets is always a valid array
  const assets = Array.isArray(state?.assets) ? state.assets : [];

  // Find the selected asset
  const selectedAsset = assets.find((asset) => asset.symbol === value);

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the selection of an asset
  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setOpen(false);
    setSearchTerm('');
  };

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {value && selectedAsset ? selectedAsset.symbol : t('trade.asset')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col">
          <div className="flex items-center border-b p-2">
            <Input
              placeholder={t('trade.searchAsset')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          <ScrollArea className="h-60">
            {filteredAssets.length > 0 ? (
              <div className="p-1">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handleSelect(asset.symbol)}
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      value === asset.symbol ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === asset.symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {asset.symbol}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('trade.noAssetsFound')}
              </div>
            )}
            {assets.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('trade.noAssets')}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableAssetSelect;
