<?php
declare(strict_types=1);

namespace Vendic\GoogleAutocomplete\Plugin\Block\Checkout;

use Magento\Checkout\Block\Checkout\LayoutProcessor;
use Vendic\GoogleAutocomplete\Model\Config\Settings;

class LayoutProcessorPlugin
{
    private Settings $settings;

    public function __construct(
        Settings $settings
    ) {
        $this->settings = $settings;
    }

    public function afterProcess(LayoutProcessor $processor, array $jsLayout): array
    {
        if (isset($jsLayout['components']['checkout']['children']['autocomplete'])) {
            $jsLayout['components']['checkout']['children']['autocomplete']
                ['streetLinesQty'] = $this->settings->getStreetLinesQty();
        }

        return $jsLayout;
    }
}
